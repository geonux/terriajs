'use strict';

import classNames from 'classnames';
import Icon from '../../Icon';
import ObserveModelMixin from '../../ObserveModelMixin';
import React from 'react';
import Styles from './concept-viewer.scss';

const Concept = React.createClass({
    mixins: [ObserveModelMixin],

    propTypes: {
        concept: React.PropTypes.object.isRequired,
        hideName: React.PropTypes.bool,
        isLoading: React.PropTypes.bool
    },

    toggleOpen() {
        this.props.concept.toggleOpen();
    },

    toggleActive() {
        this.props.concept.toggleActive();
    },

    getColorStyle() {
        if (this.props.concept.color) {
            return {color: this.props.concept.color};
        }
    },

    getFillStyle() {
        if (this.props.concept.color) {
            return {fill: this.props.concept.color};
        }
    },

    render() {
        const concept = this.props.concept;
        const allowMultiple = concept.parent && concept.parent.allowMultiple;
        const classes = classNames(Styles.header, {
            [Styles.hasChildren]: concept.hasChildren,
            [Styles.isSelectable]: concept.isSelectable,
            [Styles.isLoading]: this.props.isLoading
        });
        // Renders the concept as a standard list of radio buttons or checkboxes (ie. not as an additive-condition).
        return (
            <li style={this.getColorStyle()}>
                <If condition={!this.props.hideName && concept.name}>
                    <div className={classes}>
                        <div className={Styles.btnGroup}>
                            <If condition={concept.hasChildren}>
                                <button type='button'
                                        onClick={this.toggleOpen}
                                        style={this.getColorStyle()}
                                        className={Styles.btnToggleOpen}
                                        title='open variable selection'>
                                        {concept.isOpen ? <Icon glyph={Icon.GLYPHS.showLess}/> : <Icon glyph={Icon.GLYPHS.showMore}/>}
                                </button>
                            </If>
                            <If condition={concept.isSelectable}>
                                <button type='button'
                                        onClick={this.toggleActive}
                                        style={this.getColorStyle()}
                                        className={Styles.btnToggleActive}
                                        title='select variable'>
                                        {(concept.isActive && allowMultiple) && <Icon style={this.getFillStyle()} glyph={Icon.GLYPHS.checkboxOn}/>}
                                        {(!concept.isActive && allowMultiple) && <Icon style={this.getFillStyle()} glyph={Icon.GLYPHS.checkboxOff}/>}
                                        {(concept.isActive && !allowMultiple) && <Icon style={this.getFillStyle()} glyph={Icon.GLYPHS.radioOn}/>}
                                        {(!concept.isActive && !allowMultiple) && <Icon style={this.getFillStyle()} glyph={Icon.GLYPHS.radioOff}/>}
                                </button>
                            </If>
                        </div>
                        {concept.name}
                    </div>
                </If>
                <If condition={concept.isOpen}>
                    <ul className={Styles.items}>
                        <For each="child" index="i" of={concept.items.filter(concept => concept.isVisible)}>
                            <Concept key={i} concept={child} isLoading={this.props.isLoading}/>
                        </For>
                    </ul>
                </If>
            </li>
        );
    }
});

module.exports = Concept;